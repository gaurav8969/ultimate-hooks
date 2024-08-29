import { useState, useEffect } from 'react';
import axios from 'axios';

const useField = (type) => {
  const [value, setValue] = useState('');

  const onChange = (event) => {
    setValue(event.target.value);
  };

  return {
    type,
    value,
    onChange,
    setValue
  };
};

const useResource = (baseUrl) => {
  const [resources, setResources] = useState([]);
  const [trigger, setTrigger] = useState(false);

  useEffect(() => {
    const get = async () => {
      const response = await axios.get(baseUrl);
      setResources(response.data);
    };
    get();
  }, [baseUrl, trigger]);

  const create = async (resource) => {
    const response = await axios.post(baseUrl, resource);
    setTrigger(!trigger);
    return response.data;
  };

  const service = {
    create
  };

  return [
    resources, service
  ];
};

const App = () => {
  const { setValue: setContent, ...content } = useField('text');
  const { setValue: setName, ...name } = useField('text');
  const { setValue: setNumber, ...number } = useField('text');

  const [notes, noteService] = useResource('http://localhost:3005/notes');
  const [persons, personService] = useResource('http://localhost:3005/persons');

  const handleNoteSubmit = (event) => {
    event.preventDefault();
    setContent('');
    noteService.create({ content: content.value });
  };

  const handlePersonSubmit = (event) => {
    event.preventDefault();
    setName('');
    setNumber('');
    personService.create({ name: name.value, number: number.value });
  };

  return (
    <div>
      <h2>notes</h2>
      <form onSubmit={handleNoteSubmit}>
        <input {...content} />
        <button>create</button>
      </form>
      {notes.map(n => <p key={n.id}>{n.content}</p>)}

      <h2>persons</h2>
      <form onSubmit={handlePersonSubmit}>
        name <input {...name} /> <br/>
        number <input {...number} />
        <button>create</button>
      </form>
      {persons.map(n => <p key={n.id}>{n.name} {n.number}</p>)}
    </div>
  );
};

export default App;