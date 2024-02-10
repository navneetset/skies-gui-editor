import React, { useEffect, useState } from "react";

interface NBTValidatorProps {
  nbt: string;
  onValidNbt: (nbt: object) => void;
}

const NBTValidator = ({ nbt, onValidNbt }: NBTValidatorProps) => {
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    try {
      const parsedNbt = JSON.parse(nbt);
      setIsValid(true);
      onValidNbt(parsedNbt); // Callback with parsed NBT
    } catch (e) {
      setIsValid(false);
    }
  }, [nbt]);

  return (
    <div>
      {!isValid ? (
        <p
          style={{
            color: "red",
            fontSize: "0.6rem",
            marginTop: "0.5rem",
            textShadow: "1px 1px 0px #000",
          }}
        >
          ❌ Invalid JSON
        </p>
      ) : (
        <p
          style={{
            color: "#97EA36",
            fontSize: "0.6rem",
            marginTop: "0.5rem",
            textShadow: "1px 1px 0px #000",
          }}
        >
          ✅ Valid JSON
        </p>
      )}
    </div>
  );
};

export default NBTValidator;
