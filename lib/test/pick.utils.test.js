const assert = require('assert');
const pick = require('../../utils/pick');
const isEquale = require('lodash.isequal');

const comments = [
  {
    'postId': 1,
    'id': 1,
    'name': 'id labore ex et quam laborum',
    'email': 'Eliseo@gardner.biz',
    'body': 'laudantium enim quasi est quidem magnam voluptate ipsam eos\ntempora quo necessitatibus\ndolor quam autem quasi\nreiciendis et nam sapiente accusantium'
  },
  {
    'postId': 1,
    'id': 2,
    'name': 'quo vero reiciendis velit similique earum',
    'email': 'Jayne_Kuhic@sydney.com',
    'body': 'est natus enim nihil est dolore omnis voluptatem numquam\net omnis occaecati quod ullam at\nvoluptatem error expedita pariatur\nnihil sint nostrum voluptatem reiciendis et'
  },
  {
    'postId': 1,
    'id': 3,
    'name': 'odio adipisci rerum aut animi',
    'email': 'Nikita@garfield.biz',
    'body': 'quia molestiae reprehenderit quasi aspernatur\naut expedita occaecati aliquam eveniet laudantium\nomnis quibusdam delectus saepe quia accusamus maiores nam est\ncum et ducimus et vero voluptates excepturi deleniti ratione'
  },
  {
    'postId': 1,
    'id': 4,
    'name': 'alias odio sit',
    'email': 'Lew@alysha.tv',
    'body': 'non et atque\noccaecati deserunt quas accusantium unde odit nobis qui voluptatem\nquia voluptas consequuntur itaque dolor\net qui rerum deleniti ut occaecati'
  },
  {
    'postId': 1,
    'id': 5,
    'name': 'vero eaque aliquid doloribus et culpa',
    'email': 'Hayden@althea.biz',
    'body': 'harum non quasi et ratione\ntempore iure ex voluptates in ratione\nharum architecto fugit inventore cupiditate\nvoluptates magni quo et'
  }
];

const testData = {
  '_id': 4,
  'userId':'aak',
  'user': {
    'id': 'aak',
    'name': 'Leanne Graham',
    'username': 'Bret',
    'email': 'Sincere@april.biz',
    'address': {
      'street': 'Kulas Light',
      'suite': 'Apt. 556',
      'city': 'Gwenborough',
      'zipcode': '92998-3874',
      'geo': {
        'lat': '-37.3159',
        'lng': '81.1496'
      }
    },
    'phone': '1-770-736-8031 x56442',
    'website': 'hildegard.org',
    'company': {
      'name': 'Romaguera-Crona',
      'catchPhrase': 'Multi-layered client-server neural-net',
      'bs': 'harness real-time e-markets'
    }
  },
  'title': 'eum et est occaecati',
  'body': 'ullam et saepe reiciendis voluptatem adipisci\nsit amet autem assumenda provident rerum culpa\nquis hic commodi nesciunt rem tenetur doloremque ipsam iure\nquis sunt voluptatem rerum illo velit',
  'comments': comments
};

describe('\'pick\' util', () => {
  it('pick _id fields', () => {
    const except = { _id: 4 };
    const res = pick(testData, ['_id']);
    if(isEquale(res, except)){
      assert.ok('pick as except');
    }else{
      assert.fail('pick not as except', {res, except});
    }
  });
  it('pick user.name fields', () => {
    const except = { user: {name: 'Leanne Graham'} };
    const res = pick(testData, ['user.name']);
    if(isEquale(res, except)){
      assert.ok('pick as except');
    }else{
      assert.fail('pick not as except', {res, except});
    }
  });
  it('pick all except user and comments ', () => {
    const except = {
      '_id': 4,
      'userId':'aak',
      'title': 'eum et est occaecati',
      'body': 'ullam et saepe reiciendis voluptatem adipisci\nsit amet autem assumenda provident rerum culpa\nquis hic commodi nesciunt rem tenetur doloremque ipsam iure\nquis sunt voluptatem rerum illo velit',
    };
    const res = pick(testData, ['-user','-comments']);
    if(isEquale(res, except)){
      assert.ok('pick as except');
    }else{
      assert.fail('pick not as except', {res, except});
    }
  });
  it('get only _id and user.name with valid condiation ', () => {
    const except = {
      '_id': 4,
      'user': {
        name: 'Leanne Graham'
      }
    };
    const res = pick(testData, ['_id',{ 'user.name': {'_id': 4} }]);
    if(isEquale(res, except)){
      assert.ok('pick as except');
    }else{
      assert.fail('pick not as except', {res, except});
    }
  });
  it('get only _id and user.name with invalid condiation ', () => {
    const except = {
      '_id': 4
    };
    const res = pick(testData, ['_id',{ 'user.name': {'_id': 45} }]);
    if(isEquale(res, except)){
      assert.ok('pick as except');
    }else{
      assert.fail('pick not as except', {res, except});
    }
  });
});