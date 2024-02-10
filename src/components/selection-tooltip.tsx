import React from "react";
import styled from "styled-components";

const SelectionTooltip = () => {
  return (
    <span>
      <SelectionTooltipStyled>
        <a>(?)</a>
      </SelectionTooltipStyled>
    </span>
  );
};

export default SelectionTooltip;

const SelectionTooltipStyled = styled.div`
  position: relative;
  display: inline-block;
  text-align: center;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  line-height: 20px;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  user-select: none;
  z-index: 1;
  a {
    color: white;
    &:hover {
      color: #2c5282;
      transform: scale(1.1);
    }
    transition: transform 100ms, color 200ms;
  }

  a:hover::before {
    content: "For custom item, start typing. eg. cobblemon:poke_ball";
    font-family: "Courier New", monospace;
    position: absolute;
    left: 0;
    top: -1.5rem;
    font-size: 0.65rem;
    background-color: #2c5282;
    color: white;
    padding: 0.25rem;
    border-radius: 0.25rem;
    z-index: 1000;
    white-space: nowrap;
    display: block;
    animation: fadeIn 0.3s ease-in-out;

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  }
`;
