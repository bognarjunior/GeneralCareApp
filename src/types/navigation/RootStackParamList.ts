export type RootStackParamList = {
  Home: undefined;
  PeopleList: undefined;
  PersonDetailStack: {
    personId: string;
  };
  PeopleRegister?: { personId?: string };
};
