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





//product ,products

const add = (a, b) => a + b;
const addAll = _.reduce(add);
class Product extends Model {} // Model 클래스 계승
class Products extends Collection { //Collection 클래스 계승.
  getPrices() {
    return L.map(p => p.get('price'), this); // p.get('price') 속성이름을 뽑아주는거임.
  }
  totalPrice() {
    return addAll(this.getPrices());
  }
}

const products = new Products();
products.add(new Product({ id: 1, price: 10000 }));
console.log( products.totalPrice() );

products.add(new Product({ id: 3, price: 25000 }));
console.log( products.totalPrice() );

products.add(new Product({ id: 5, price: 35000 }));
console.log( products.totalPrice() );