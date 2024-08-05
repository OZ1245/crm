interface IReturns {
  minPasswordCharacters: number;
}

export function useConfig() {
  const minPasswordCharacters = 8;

  return <IReturns> {
    minPasswordCharacters
  }
}
