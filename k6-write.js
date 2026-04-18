import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 10,
  duration: '10s',
};

export default function () {
  const url = 'http://localhost:3000/api/v1/reports';

  const payload = JSON.stringify({
    category: 'traffic',
    location: 'Ramallah',
    description: `Load test report ${__VU}-${__ITER}`,
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': ' Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEzLCJlbWFpbCI6InVzZXIxQGV4YW1wbGUuY29tIiwicm9sZSI6IkNJVElaRU4iLCJpYXQiOjE3NzY1MjcxMzksImV4cCI6MTc3NjYxMzUzOX0.dxUGHV41lS9FnQ7E-UB6UJq1NXX_aXtUkJcceL-P8sI',
    },
  };

  const res = http.post(url, payload, params);

  console.log(`status: ${res.status} body: ${res.body}`);

  check(res, {
    'status is 201 or 200': (r) => r.status === 201 || r.status === 200,
  });

  sleep(1);
}