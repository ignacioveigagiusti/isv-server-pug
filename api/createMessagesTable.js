const msgOptions = require('../options/sqlite');
const knex = require('knex')(msgOptions);

const messages = [
  {
    "author": "user_1@xmail.com",
    "timestamp": "Thu Apr 14 2022 00:10:38 GMT-0300",
    "text": "Hi!"
  },
  {
    "author": "evil_server@xmail.com",
    "timestamp": "Thu Apr 14 2022 00:10:53 GMT-0300",
    "text": "Goodbye!"
  },
  {
    "author": "user_1@xmail.com",
    "timestamp": "Thu Apr 14 2022 00:11:09 GMT-0300",
    "text": "Oh, okay, see you!"
  }
];

const createMessagesTable = async() => {
knex.schema.dropTableIfExists('messages')
.then(async()=>{
  await knex.schema.createTable('messages', table => {
    table.string('author');
    table.string('timestamp');
    table.string('text');
  });
  await knex('messages').insert(messages);
})
.finally(async()=>{
  knex('messages').select('*').then((rows) => {
  let rowsarr = rows;
  rowsarr.map(row => console.log(row));
  });
})}

createMessagesTable();