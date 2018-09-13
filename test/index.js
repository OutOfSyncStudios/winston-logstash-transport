const chai = require('chai');
const expect = chai.expect;

const MainClass = require('../');

describe('Base Class', () => {
  it('load', () => {
    const MyClass = require('../');
    const myModule = new MyClass();

    expect(myModule).to.be.instanceof(MainClass);
  });
});
