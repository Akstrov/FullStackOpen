import { useState, useEffect } from "react";
import personService from "./services/persons";

const SuccessNotification = ({ message }) => {
  if (message === null) {
    return null;
  }

  return <div className="success">{message}</div>;
};

const ErrorNotification = ({ message }) => {
  if (message === null) {
    return null;
  }

  return <div className="error">{message}</div>;
};

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

const Persons = ({ persons, removePerson }) => {
  return (
    <>
      {persons.map((person) => (
        <PersonDetails
          key={person.id}
          person={person}
          removePerson={removePerson}
        >
          {person.name} {person.number}
        </PersonDetails>
      ))}
    </>
  );
};

const PersonDetails = ({ person, removePerson }) => {
  return (
    <div>
      {person.name} {person.number}
      <button
        onClick={() =>
          window.confirm(`delete ${person.name} from phonebook?`)
            ? removePerson(person.id)
            : null
        }
      >
        delete
      </button>
    </div>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    personService.getAll().then((initialPersons) => setPersons(initialPersons));
  }, []);

  const submitHandler = (event) => {
    event.preventDefault();
    console.log(newName, newNumber);
    const exist = persons.find((person) => person.name === newName);
    exist
      ? window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
        ? personService
            .update(exist.id, { name: newName, number: newNumber })
            .then((returnedPerson) => {
              setPersons(
                persons.map((person) =>
                  person.id !== exist.id ? person : returnedPerson
                )
              );
              setSuccessMessage(`Updated ${returnedPerson.name}`);
              setTimeout(() => {
                setTimeout(() => {
                  setSuccessMessage(null);
                }, 5000);
              });
            })
            .catch((error) => {
              setErrorMessage(
                `Information of ${exist.name} has already been removed from server`
              );
              setPersons(persons.filter((person) => person.id !== exist.id));
              setTimeout(() => {
                setErrorMessage(null);
              }, 5000);
            })
        : null
      : personService
          .create({
            name: newName,
            number: newNumber,
          })
          .then((returnedPerson) => {
            setPersons(persons.concat(returnedPerson));
            setSuccessMessage(`Added ${returnedPerson.name}`);
            setTimeout(() => {
              setSuccessMessage(null);
            }, 5000);
          });
    setNewName("");
    setNewNumber("");
  };

  const removePerson = (id) => {
    personService.remove(id).then(() => {
      setPersons(persons.filter((person) => person.id !== id));
    });
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
    setPersons(filteredPersons);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <SuccessNotification message={successMessage} />
      <ErrorNotification message={errorMessage} />
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
      <Persons persons={persons} removePerson={removePerson} />
    </div>
  );
};

export default App;
