//05. 사용자 정의 객체를 이터러블 프로그래밍으로 다루기
// Map Set

let m = new Map();
m.set('a', 1);
m.set('b', 2);
m.set('c', 3);

_.go(
  m,
  _.filter(([k, v]) => v % 2),
  entries => new Map(entries), // map 이나 set을 이용해서
  // 만약 key , value 값을 기준으로 거른다음에 v%2 와 같은 것들을 
  // 거른이후에 그 거른값으로 다시 entries로 만들수도 있음.
  console.log);

let s = new Set();
s.add(10);
s.add(20);
s.add(30);

// const add = (a, b) => a + b;
//
// console.log(_.reduce(add, s));




//2. Model,Collection

class Model {
  constructor(attrs = {}) {//attrs는 객체임지금.
    this._attrs = attrs;
  }
  get(k) {
    return this._attrs[k];// value를 return
  }
  set(k, v) {
    this._attrs[k] = v;
    return this;
  }
}
class Collection {
  constructor(models = []) {
    this._models = models;
  }
  at(idx) {
    return this._models[idx];
  }
  add(model) {
    this._models.push(model);
    return this;
  }
  *[Symbol.iterator]() { //* generator로 선언함. 
    yield *this._models;
  }
}

const coll = new Collection();
coll.add(new Model({ id: 1, name: 'AA' }));
coll.add(new Model({ id: 3, name: 'BB' }));
coll.add(new Model({ id: 5, name: 'CC' }));
console.log(coll.at(2).get('name'));
console.log(coll.at(1).get('id'));

_.go(
  coll,
  L.map(m => m.get('name')),
  _.each(console.log));

_.go(
  coll,
  _.each(m => m.set('name', m.get('name').toLowerCase())));

  console.clear();
  
//4. 어떠한 값이든 이터러블 프로그래밍으로 다루기

const g1 = function *(stop) { //* 표시는 generator
  let i = -1;
  while (++i < stop) {
    yield 10; //배열에는 지금 10 30 10이 들어가있음.
    if (false) yield 20 + 30; // 
    yield 30;
  }
};

console.log([...L.take(3, g1(10))]); // g1(10) 넣는다는건 지금
//10개를 보낸거임 (10,30)쌍을 10 30 10 30 10 30 1030 그중 3개만뽑았으니
//결과값이 10 30 10 이 되는거고
// _.each(console.log, g1(10)); >>함수 내부에서 어떤일이 일어나는지
// 값을 직접 확인 해 볼 수 있음.


_.go(
  g1(10),//
  L.take(2), // 모든 값들중 2개를 뽑는거니까 10 ,30 을 뽑아서 값을 더하니까
  //40이 나오는거임.
  _.reduce((a, b) => a + b),
  console.log);






  //5. object
  const a = [['a', 1], ['b', 2], ['c', 3]];
const b = {a: 1, b: 2, c: 3};//a의 값을 b로 만드는거임
//entries를 객체로 만드는게 object이다.

// const object = entries => _.go(
//   entries,
//   L.map(([k, v]) => ({ [k]: v })),
//   _.reduce(Object.assign));  => assign이 심플한 자료구조라서 어차피
// 결과값은 그대로나옴.

const object = entries =>
  _.reduce((obj, [k, v]) => (obj[k] = v, obj), {}, entries);
 //이 명령문을 축약하면 . 결국 obj를 받고 , k , v 가 들어오면
 // key와 value를 v ,obj로 바꾸고 {} << 객체 형태로 받는다 그리고
 // 받을 내용은 entries에 관련된 내용이다.
console.log(object(L.entries({b: 2, c: 3})));

let m = new Map();
m.set('a', 10);
m.set('b', 20);
m.set('c', 30);

console.log(object(m));
// 그냥 map 자료구조는 서버랑 통신하기 위해서 값을 날리면 사라짐
// JSON이 지원이 안되서 근데 이걸 object(m) 이렇게 객체로 씌워주는 일을
// 하게 된다면 서버에게 JSON으로 값을 보낼 수 있음.
//map 같은 entries를 발생시키는 녀석들을 객체로 만들 수 있게함.

//6.mapObject

const mapObject = (f, obj) => _.go(
  obj,
  L.entries,
  _.map(([k, v]) => [k, f(v)]),
  object);

console.log(mapObject(a => a + 10, { a: 1, b: 2, c: 3 }));
// [['a', 1], ['b', 2], ['c', 3]]
// [['a', 11], ['b', 12], ['c', 13]]
// { a: 11 } ...
// { a: 11, b: 12, c: 13 }

//위에 있는 부분이 mapObject식 사고 방식이다 iterable 한 사고방식이라고 볼 수 있다.

//7. pick  특정 객체만 뽑아오는거임.
const obj2 = { a: 1, b: 2, c: 3, d: 4, e: 5 };

const pick = (ks, obj) => _.go(
  ks,
  L.map(k => [k, obj[k]]),
  L.reject(([k, v]) => v === undefined), // reject = 거절 v===undefined면 안쓴다 . 이런
  //거임.
  object);

console.log(pick(['b', 'c', 'z'], obj2));
// { b: 2, c: 3 }
// undefined 라는 최대한 안쓰는게 바람직하다.
  


//8. indexBy

const users = [
  { id: 5, name: 'AA', age: 35 },
  { id: 10, name: 'BB', age: 26 },
  { id: 19, name: 'CC', age: 28 },
  { id: 23, name: 'CC', age: 34 },
  { id: 24, name: 'EE', age: 23 }
];

_.indexBy = (f, iter) =>
  _.reduce((obj, a) => (obj[f(a)] = a, obj), {}, iter);

const users2 = _.indexBy(u => u.id, users);  // 여기서 u.id값으로 
// 인덱스를 만들어서 객체를 뽑아 낼 수있음.

console.log(users2);


//9 indexBy 된 값을 filter하기
// 원래 기본적으로 indexBy 된 값들은 filter를 할수가없음 
//일단 indexBy를 만들게 되면 iterable이 아니기 때문임.
//해결방법 은 entries
// console.log(_.filter(({age}) => age >= 30, users));
const users3 = _.go(
  users2,
  L.entries, // 처음에 indexBy 된것이 제대로 완성이 안되니까 entries로 만들어주고 그에 맞게
  // 해결 해 주는게 맞음.
  L.filter(([_, {age}]) => age < 30),
  L.take(2),
  object);

console.log(users3[19]);