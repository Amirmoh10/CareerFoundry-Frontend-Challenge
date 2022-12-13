import { REQUEST } from "../constants";

const MESSAGE = {
  [REQUEST.LOADING]: "...LOADING",
  [REQUEST.ERROR]: "There was an error loading data",
};

export default function FeedbackMessage({ requestStatus }) {
  return (
    <span data-testid={`request-${requestStatus}`}>
      {MESSAGE[requestStatus]}
    </span>
  );
}
