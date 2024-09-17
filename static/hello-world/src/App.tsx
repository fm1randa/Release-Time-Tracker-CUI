import React, { Fragment, useEffect, useState } from "react";
import { invoke } from "@forge/bridge";

function App() {
  const [data, setData] = useState<string | null>(null);

  useEffect(() => {
    invoke("getText", { example: "my-invoke-variable" }).then((text) => {
      if (typeof text !== "string") return;
      setData(text);
    });
  }, []);

  return (
    <Fragment>
      <div>{data ? data : "Loading..."}</div>
      <p>
        Using HTML freely opens up endless possibilities for web development! It
        gives you full control over structuring your content, styling with CSS,
        and even integrating powerful JavaScript functionalities. With HTML,
        you're not limited by predefined components, allowing you to create
        highly customized, responsive, and interactive user experiences. The
        freedom to use HTML makes it easy to design web pages exactly how you
        envision them, ensuring flexibility and creativity in your projects.
        It's a fantastic way to harness the full potential of web technologies!
      </p>
    </Fragment>
  );
}

export default App;
