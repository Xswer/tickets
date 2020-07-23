import nats, { Stan } from 'node-nats-streaming';

class NatsClient {
  private _client?: Stan;

  get client() {
    if (!this._client)
      throw new Error('Can not access NATS client before connecting');
    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise((resolve, reject) => {
      this.client.on('connect', (err) => {
        console.log('Connected to NATS');
        return resolve();
      });

      this.client.on('error', (err) => {
        return reject(err);
      });
    });
  }
}

export const natsClient = new NatsClient();
