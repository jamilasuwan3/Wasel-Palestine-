import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '10s',
};

export default function () {
  const getRes = http.get('http://localhost:3000/api/v1/incidents');

  check(getRes, {
    'GET status 200': (r) => r.status === 200,
  });

  const payload = JSON.stringify({
    category: 'traffic',
    location: 'Ramallah',
    description: `Mixed test ${__VU}-${__ITER}`,
  });

  const postRes = http.post(
    'http://localhost:3000/api/v1/reports',
    payload,
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEzLCJlbWFpbCI6InVzZXIxQGV4YW1wbGUuY29tIiwicm9sZSI6IkNJVElaRU4iLCJpYXQiOjE3NzY1MjcxMzksImV4cCI6MTc3NjYxMzUzOX0.dxUGHV41lS9FnQ7E-UB6UJq1NXX_aXtUkJcceL-P8sI',
      },
    },
  );

  check(postRes, {
    'POST status 200 or 201': (r) => r.status === 200 || r.status === 201,
  });

  sleep(1);
}