import { render, screen, waitFor } from "@testing-library/react";
import { setupServer } from "msw/node";
import { rest } from "msw";

import { COURSES_URL, USER_LOCATION_URL } from "../constants";
import App from "./App";

const MOCKS = {
  COURSES: [
    {
      slug: "voice-user-interface-design-with-amazon-alexa",
      title: "Voice User Interface Design",
      url: "https://careerfoundry.com/en/courses/voice-user-interface-design-with-amazon-alexa/",
      next_start: "2022-10-10",
      next_start_formatted: "Monday, October 10th, 2022",
    },
    {
      slug: "full-stack-immersion",
      title: "Full-Stack Immersion",
      url: "https://careerfoundry.com/en/courses/become-a-web-developer/",
      next_start: "2022-10-17",
      next_start_formatted: "Monday, October 17th, 2022",
    },
  ],
  USER_LOCATION: {
    location: {
      is_eu: true,
    },
  },
};

const server = setupServer(
  rest.get(COURSES_URL, (req, res, ctx) => {
    return res(ctx.json(MOCKS.COURSES));
  }),
  rest.get(USER_LOCATION_URL, (req, res, ctx) => {
    return res(ctx.json(MOCKS.USER_LOCATION));
  })
);

beforeAll(() => {
  return server.listen();
});
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("loads and displays courses", async () => {
  render(<App />);
  return waitFor(() =>
    expect(screen.getByTestId("courses")).toBeInTheDocument()
  );
});

test("handles server error", async () => {
  server.use(
    rest.get(COURSES_URL, (req, res, ctx) => {
      return res(ctx.status(500));
    })
  );
  render(<App />);
  expect(screen.getByTestId("request-LOADING")).toBeInTheDocument();
  return waitFor(() =>
    expect(screen.getByTestId("request-ERROR")).toBeInTheDocument()
  );
});
