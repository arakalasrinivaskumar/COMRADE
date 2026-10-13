// src/__tests__/Header.test.jsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Header from "../components/Header";
import { ThemeProvider } from "../context/ThemeContext";

test("Header renders and theme toggles", () => {
  render(
    <ThemeProvider>
      <Header />
    </ThemeProvider>,
  );

  // Verify title is present
  expect(screen.getByText(/COMRADE/i)).toBeInTheDocument();

  // Theme toggle button should be present
  const toggleBtn = screen.getByRole("button", { name: /dark|light/i });
  const initialTheme = document.documentElement.getAttribute("data-theme");

  fireEvent.click(toggleBtn);
  const newTheme = document.documentElement.getAttribute("data-theme");
  expect(newTheme).not.toBe(initialTheme);
});
