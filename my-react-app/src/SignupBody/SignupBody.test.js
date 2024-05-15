// src/components/SignupBody.test.js
import { render, screen, fireEvent } from "@testing-library/react";
import SignupBody from "./SignupBody";
import { BrowserRouter as Router } from "react-router-dom";

test("Statement Coverage for SignupBody", () => {
  render(
    <Router>
      <SignupBody />
    </Router>
  );

  const firstNameInput = screen.getByLabelText(/first name/i);
  const lastNameInput = screen.getByLabelText(/last name/i);
  const emailInput = screen.getByLabelText(/email address/i);
  const passwordInput = screen.getByLabelText(/password/i);
  const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
  const submitButton = screen.getByRole("button", { name: /sign up/i });

  fireEvent.change(firstNameInput, { target: { value: "John" } });
  fireEvent.change(lastNameInput, { target: { value: "Doe" } });
  fireEvent.change(emailInput, { target: { value: "john.doe@example.com" } });
  fireEvent.change(passwordInput, { target: { value: "password123" } });
  fireEvent.change(confirmPasswordInput, { target: { value: "password123" } });

  fireEvent.click(submitButton);
});

test("Branch Coverage for SignupBody", async () => {
  render(
    <Router>
      <SignupBody />
    </Router>
  );

  const firstNameInput = screen.getByLabelText(/first name/i);
  const lastNameInput = screen.getByLabelText(/last name/i);
  const emailInput = screen.getByLabelText(/email address/i);
  const passwordInput = screen.getByLabelText(/password/i);
  const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
  const submitButton = screen.getByRole("button", { name: /sign up/i });

  // Branch 1: Passwords do not match
  fireEvent.change(firstNameInput, { target: { value: "John" } });
  fireEvent.change(lastNameInput, { target: { value: "Doe" } });
  fireEvent.change(emailInput, { target: { value: "john.doe@example.com" } });
  fireEvent.change(passwordInput, { target: { value: "password123" } });
  fireEvent.change(confirmPasswordInput, { target: { value: "password456" } });

  fireEvent.click(submitButton);
  expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();

  // Branch 2: Passwords match and API call success
  fireEvent.change(confirmPasswordInput, { target: { value: "password123" } });
  fireEvent.click(submitButton);

  // Mock the fetch API call to return a successful response
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ user: { Email: "john.doe@example.com", Admin: "No" } }),
    })
  );

  fireEvent.click(submitButton);
  expect(global.fetch).toHaveBeenCalled();
});
