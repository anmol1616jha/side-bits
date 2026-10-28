import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ChoiceGroup } from "../choice-group";

describe("ChoiceGroup", () => {
  it("is a labelled radio group that reports changes", () => {
    const onChange = vi.fn();
    render(
      <ChoiceGroup
        legend="Indent"
        value="2"
        onChange={onChange}
        options={[
          { value: "2", label: "2 spaces" },
          { value: "4", label: "4 spaces" },
        ]}
      />,
    );

    expect(screen.getByRole("group", { name: "Indent" })).toBeTruthy();
    expect((screen.getByRole("radio", { name: "2 spaces" }) as HTMLInputElement).checked).toBe(
      true,
    );
    fireEvent.click(screen.getByRole("radio", { name: "4 spaces" }));
    expect(onChange).toHaveBeenCalledWith("4");
  });
});
