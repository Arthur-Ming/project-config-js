export default class Hello {
  text;

  constructor(text = "hello") {
    this.text = text;
  }

  show = () => {
    console.log(this.text);
  };
}
