import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders service center navigation", () => {
  render(<App />);
  expect(screen.getByText(/Operations Console/i)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /Jobs/i })).toBeInTheDocument();
});
