import axios from "axios";
import { useState, useEffect } from "react";

const Filter = ({ handler }) => {
  return (
    <div>
      filter shown with: <input onChange={handler} />
    </div>
  );
};
const PersonForm = ({
  newName,
  newNumber,
  submitHandler,
  newNameHandler,
  newNumberHandler,
}) => {
  return (
    <>
      <form onSubmit={submitHandler}>
        <div>
          name: <input value={newName} onChange={newNameHandler} />
        </div>
        <div>
          number: <input value={newNumber} onChange={newNumberHandler} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </>
  );
};

const Persons = ({ persons }) => {
  return (
    <>
      {persons.map((person) => (
        <div key={person.id}>
          {person.name} {person.number}
        </div>
      ))}
    </>
  );
};

const PersonDetails = ({ person }) => {
  return (
    <p>
      {person.name} {person.number}
    </p>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const hook = () => {
    axios.get("http://localhost:3001/persons").then((response) => {
      setPersons(response.data);
    });
  };

  useEffect(hook, []);

  const submitHandler = (event) => {
    event.preventDefault();
    console.log(newName, newNumber);
    const exist = persons.find((person) => person.name === newName);
    exist
      ? alert(`${newName} is already added to phonebook`)
      : setPersons(persons.concat({ name: newName, number: newNumber })),
      setNewName("");
    setNewNumber("");
  };
  const newNameHandler = (event) => {
    setNewName(event.target.value);
  };

  const newNumberHandler = (event) => {
    setNewNumber(event.target.value);
  };

  const filterHandler = (event) => {
    if (event.target.value === "") {
      hook();
      return;
    }
    const filteredPersons = persons.filter((person) =>
      person.name.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setPersons(filteredPersons);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter handler={filterHandler} />
      <h2>Add a new</h2>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        submitHandler={submitHandler}
        newNameHandler={newNameHandler}
        newNumberHandler={newNumberHandler}
      />

      <h2>Numbers</h2>
      <Persons persons={persons} />
    </div>
  );
};

export default App;
