"use client"
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

// Component types
type ComponentType = "text" | "radio" | "checkbox";

interface Component {
  id: string;
  type: ComponentType;
  label: string;
  options?: string[];
}

interface Screen {
  id: string;
  title: string;
  components: Component[];
}

const FlowBuilder: React.FC = () => {
  const [screens, setScreens] = useState<Screen[]>([]);

  // Add a new screen
  const addScreen = () => {
    const newScreen: Screen = {
      id: uuidv4(),
      title: `Screen ${screens.length + 1}`,
      components: [],
    };
    setScreens((prev) => [...prev, newScreen]);
  };

  // Update screen title
  const updateScreenTitle = (screenId: string, title: string) => {
    setScreens((prev) =>
      prev.map((screen) => (screen.id === screenId ? { ...screen, title } : screen))
    );
  };

  // Add a component to a screen
  const addComponent = (screenId: string, type: ComponentType) => {
    const newComponent: Component = {
      id: uuidv4(),
      type,
      label: type === "text" ? "Enter text" : "Select an option",
      options: type !== "text" ? ["Option 1", "Option 2"] : undefined,
    };

    setScreens((prev) =>
      prev.map((screen) =>
        screen.id === screenId
          ? { ...screen, components: [...screen.components, newComponent] }
          : screen
      )
    );
  };

  // Update component label
  const updateComponentLabel = (screenId: string, compId: string, label: string) => {
    setScreens((prev) =>
      prev.map((screen) =>
        screen.id === screenId
          ? {
              ...screen,
              components: screen.components.map((comp) =>
                comp.id === compId ? { ...comp, label } : comp
              ),
            }
          : screen
      )
    );
  };

  // Convert UI to JSON
  const generateJson = () => JSON.stringify({ flow_id: "custom_flow", screens }, null, 2);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Flow Builder</h2>
      <button onClick={addScreen}>+ Add Screen</button>

      {screens.map((screen) => (
        <div key={screen.id} style={{ border: "1px solid black", padding: "10px", margin: "10px" }}>
          {/* Editable Screen Title */}
          <input
            type="text"
            value={screen.title}
            onChange={(e) => updateScreenTitle(screen.id, e.target.value)}
            placeholder="Screen Title"
          />

          <div>
            <button onClick={() => addComponent(screen.id, "text")}>+ Text Input</button>
            <button onClick={() => addComponent(screen.id, "radio")}>+ Radio Group</button>
            <button onClick={() => addComponent(screen.id, "checkbox")}>+ Checkbox</button>
          </div>

          {/* List of Components */}
          <ul>
            {screen.components.map((comp) => (
              <li key={comp.id}>
                <input
                  type="text"
                  value={comp.label}
                  onChange={(e) => updateComponentLabel(screen.id, comp.id, e.target.value)}
                />
                {comp.type !== "text" && <span> (Options: {comp.options?.join(", ")})</span>}
              </li>
            ))}
          </ul>
        </div>
      ))}

      <pre>{generateJson()}</pre>
      <button onClick={() => navigator.clipboard.writeText(generateJson())}>Copy JSON</button>
    </div>
  );
};

export default FlowBuilder;
