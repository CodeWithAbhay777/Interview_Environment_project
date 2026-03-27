import axios from 'axios';

const runCode = async () => {
  const res = await axios.post(
    "https://ce.judge0.com/submissions?wait=true",
    {
      source_code: "print('Hello World')",
      language_id: 71
    }
  );

  console.log(res.data);
};

runCode();