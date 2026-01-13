import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders service center navigation", () => {
  render(<App />);
  expect(screen.getByText(/Operations Console/i)).toBeInTheDocument();

  // Sidebar item is exactly "Jobs"; avoid matching "Manage jobs" in the Overview card.
  expect(screen.getByRole("link", { name: /^Jobs$/i })).toBeInTheDocument();
});
