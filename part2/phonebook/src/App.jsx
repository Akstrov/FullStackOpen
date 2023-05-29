import { useState } from "react";

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

const Persons = ({ shownPersons }) => {
  return (
    <>
      {shownPersons.map((person) => (
        <PersonDetails key={person.name} person={person} />
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
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-123456" },
    { name: "Ada Lovelace", number: "39-44-5323523" },
    { name: "Dan Abramov", number: "12-43-234345" },
    { name: "Mary Poppendieck", number: "39-23-6423122" },
  ]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [shownPersons, setShownPersons] = useState(persons);

  const submitHandler = (event) => {
    event.preventDefault();
    console.log(newName, newNumber);
    const exist = persons.find((person) => person.name === newName);
    exist
      ? alert(`${newName} is already added to phonebook`)
      : setPersons(persons.concat({ name: newName, number: newNumber })),
      setShownPersons(persons.concat({ name: newName, number: newNumber }));
    setNewName("");
    setNewNumber("");
    console.log("after ", shownPersons);
  };
  const newNameHandler = (event) => {
    setNewName(event.target.value);
  };

  const newNumberHandler = (event) => {
    setNewNumber(event.target.value);
  };

  const filterHandler = (event) => {
    const filteredPersons = persons.filter((person) =>
      person.name.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setShownPersons(filteredPersons);
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
      <Persons shownPersons={shownPersons} />
    </div>
  );
};

export default App;
