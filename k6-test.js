import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 10, // عدد المستخدمين
  duration: '10s',
};

export default function () {
  const res = http.get('http://localhost:3000/api/v1/incidents');

  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  sleep(1);
}