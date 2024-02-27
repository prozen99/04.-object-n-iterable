//객체를 이터러블 프로그래밍으로 다루기.
const obj1 = {
  a: 1,
  b: 2,
  c: 3,
  d: 4
};

console.log(Object.values(obj1)); // obj1이라는 객체의 object 값을
//확인 해주는 함수가 .values임.

L.values = function *(obj) {
  for (const k in obj) {
    yield obj[k];
  }
};

_.go( // 
  obj1, // 객체 와  a:1 b:2 
  //객체는 iterator니까 하나씩 돌아가게됨.
  L.values,//객체의 값을 체크하고 1 2 3 4
  L.map(a => a + 10), // 매개변수는 매개변수+10으로 값을 나타내주고
  L.take(2),//2개를 뽑는다 take를 쓰거나 하면 
  // c언어 malloc 마냥 동적으로 배열 크기를 할당할 수 있기 떄문에
  // 더욱 비용이 감소하게 된다.
  _.reduce((a, b) => a + b),//그리고  두개의 값은 합을 해준다.
  console.log); //11+12 =23 


  //2. entries key value 들이 들어있는 entries를 만드는 방법.

  L.entries = function *(obj) {
    for (const k in obj) {
      yield [k, obj[k]]; // 매개변수로 받은 obj 객체 전부를 순회하면서 
      //그 값들을 entries 객체에 넣는다.
    }
  };
  //이터러블이 아니었던 값을 이터러블로 만들어서 entries =generator 
  // 뒤에 iterable 하게 값을 뽑아내는 절차를 의미하는거임.

  _.go(
    obj1,
    L.entries, // entries 값을 가져오고 
    L.filter(([_, v]) => v % 2),// _는 사용안하고 v를 받아서 
    //v%2==true ==1 이니까 값을 받아오는거임.
    L.map(([k, v]) => ({ [k]: v })),
    _.reduce(Object.assign),
    console.log);
  
//3 keys

L.keys = function *(obj) {
  for (const k in obj) {
    yield k; // key값 만 돌리는 절
  }
};
//entries == generator 
//  다양한 응용사례 존재 .
_.go(
  obj1,
  L.keys,
  _.each(console.log)); // 뒤에 키를 모두 확인 하는 절차임.


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