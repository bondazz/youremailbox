import Imap from 'node-imap';
import { simpleParser } from 'mailparser';

const IMAP_CONFIG = {
  user: 'temp@tempmaila.org',
  password: 'Samir_1155',
  host: 'tempmaila.org',
  port: 993,
  tls: true,
  tlsOptions: { rejectUnauthorized: false }
};

export interface EmailMessage {
  id: string;
  from: string;
  to: string;
  subject: string;
  date: Date;
  text: string;
  html: string;
}

export async function fetchEmails(alias: string): Promise<EmailMessage[]> {
  return new Promise((resolve, reject) => {
    const imap = new Imap(IMAP_CONFIG);

    const cleanup = () => {
      if (imap.state !== 'disconnected') {
        imap.end();
      }
    };

    imap.once('ready', () => {
      imap.openBox('INBOX', true, (err, box) => {
        if (err) {
          cleanup();
          return reject(err);
        }

        // Optimized Search: Server-side search by TO header
        imap.search([['HEADER', 'TO', alias]], (err, results) => {
          if (err) {
            cleanup();
            return reject(err);
          }

          if (results.length === 0) {
            cleanup();
            return resolve([]);
          }

          // Fetch only the last 10 relevant emails
          const fetchRange = results.slice(-10);
          const f = imap.fetch(fetchRange, { bodies: '' });
          const messages: EmailMessage[] = [];
          let processed = 0;

          f.on('message', (msg, seqno) => {
            msg.on('body', (stream) => {
              simpleParser(stream, (err, parsed) => {
                processed++;
                if (!err) {
                  messages.push({
                    id: parsed.messageId || seqno.toString(),
                    from: parsed.from?.text || 'Unknown',
                    to: alias,
                    subject: parsed.subject || '(No Subject)',
                    date: parsed.date || new Date(),
                    text: parsed.text || '',
                    html: parsed.html || parsed.textAsHtml || ''
                  });
                }

                if (processed === fetchRange.length) {
                  messages.sort((a, b) => b.date.getTime() - a.date.getTime());
                  cleanup();
                  resolve(messages);
                }
              });
            });
          });

          f.once('error', (err) => {
            cleanup();
            reject(err);
          });
        });
      });
    });

    imap.once('error', (err: any) => {
      cleanup();
      reject(err);
    });

    imap.connect();
  });
}
