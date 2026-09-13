import mongoose from 'mongoose';
import { User } from './models/User.js';

const base = 'http://localhost:8080/api/auth';
const email = `route.test.${Date.now()}@example.com`;
const password = 'TestPass123!';
const newPassword = 'NewPass456!';

const expectStatus = async (label, res, expected) => {
  const text = await res.text();
  let data = {};
  try { data = JSON.parse(text); } catch { data = { raw: text }; }
  console.log(label, '=>', res.status, JSON.stringify(data));
  if (res.status !== expected) {
    throw new Error(`${label} expected ${expected} but got ${res.status}: ${JSON.stringify(data)}`);
  }
  return data;
};

try {
  await mongoose.connect('mongodb+srv://jahangir:dHKfwPxXzdOLtNo3@cluster0.0ypdela.mongodb.net/');

  let res = await fetch(base + '/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const signupData = await expectStatus('signup', res, 201);
  const token = signupData.token;
  if (!token) throw new Error('signup token missing');

  res = await fetch(base + '/send-verification-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({})
  });
  await expectStatus('send verification otp', res, 200);

  let user = await User.findOne({ email });
  if (!user || !user.otp) throw new Error('verification OTP missing');

  res = await fetch(base + '/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ otp: user.otp })
  });
  await expectStatus('verify otp', res, 200);

  res = await fetch(base + '/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  await expectStatus('login after verification', res, 201);

  res = await fetch(base + '/send-reset-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  await expectStatus('send reset otp', res, 200);

  user = await User.findOne({ email });
  if (!user || !user.resetotp) throw new Error('reset OTP missing');

  res = await fetch(base + '/verify-reset-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp: user.resetotp })
  });
  await expectStatus('verify reset otp', res, 200);

  res = await fetch(base + '/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, newPassword })
  });
  await expectStatus('reset password', res, 200);

  res = await fetch(base + '/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: newPassword })
  });
  await expectStatus('login with new password', res, 201);

  res = await fetch(base + '/send-verification-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  });
  await expectStatus('unauthorized verification check', res, 401);

  console.log('ALL ROUTES PASS');
} catch (error) {
  console.error('TEST_FAILURE:', error.message);
  process.exit(1);
} finally {
  await mongoose.disconnect().catch(() => {});
}
