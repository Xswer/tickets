import axios from 'axios';

export default ({ req }) => {
  if (typeof window === 'undefined') {
    return axios.create({
      // baseURL: 'http://nginx-ingress-controller.kube-system.svc.cluster.local',
      baseURL: 'http://www.tickets-best.xyz',
      headers: req.headers,
    });
  } else {
    return axios.create({});
  }
};
