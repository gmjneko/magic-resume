export const shouldShowFieldLabel = (
  displayLabel: boolean | undefined,
  useIconMode: boolean
) => displayLabel === true || !useIconMode;
