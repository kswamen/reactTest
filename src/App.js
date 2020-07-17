import React, { Component } from "react";
import Customer from "./components/Customer";
import "./App.css";

const customer = {
  name: "홍길동",
  birthday: "951222",
  gender: "남자",
  job: "대학생",
};

class App extends Component {
  render() {
    return (
      <Customer
        name={customer.name}
        birthday={customer.birthday}
        gender={customer.gender}
        job={customer.job}
      ></Customer>
    );
  }
}

export default App;
