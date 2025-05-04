import express from 'express';
import TestSession from '../models/TestSession.js';

const router = express.Router();

router.post('/start', async (req, res) => {
  const studentId   = req.user.id;
  if(!studentId) return res.status(401).json({ message: 'Unauthorized, please login and try again.'});
  const { testId } = req.body;
  let session = await TestSession.findOne({ studentId, testId, isSubmitted: false });

  if (!session) {
    session = await TestSession({ studentId, testId, isSubmitted: false });

    await session.save();
  }

  // console.log("Session: ", session);
  if(!session) return res.status(500).json({ success: false, message: 'Failed to create test session'});
  res.status(200).json({ success: true, message: "Test Session successfully created", session: session });
});

router.get('/:testId', async (req, res) => {
  const studentId = req.user.id;
  if(!studentId) {
    return res.status(401).json({ message: 'Unauthorized, please login and try again.'});
  }
  const { testId } = req.params;
  const session = await TestSession.findOne({ studentId, testId, isSubmitted: false });
  res.json({
    success: true, 
    data: session ? { isStarted: true, session } : { isStarted: false, session: null }
  });
});

router.patch('/:sessionId', async (req, res) => {
    const { sessionId } = req.params;
    const { answers, currentQuestionIndex } = req.body;
    const session = await TestSession.findById(sessionId);
    if (!session) return res.sendStatus(404);
  
    session.answers = answers;
    session.currentQuestionIndex = currentQuestionIndex;
    session.lastSavedAt = Date.now();
    session.isStarted = true;
    await session.save();
    res.json({ ok: true });
});

router.patch('/:sessionId/start', async (req, res) => {
  const { sessionId } = req.params;
  const session = await TestSession.findById(sessionId);
  if (!session) return res.sendStatus(404);
  else {
    session.startedAt = Date.now();
    session.isStarted = true;
    await session.save();
  }
  res.json({ success: true });
});

router.post('/:sessionId/submit', async (req, res) => {
  await TestSession.findByIdAndUpdate(req.params.sessionId, { isSubmitted: true });
  res.json({ ok: true });
});

export default router;
