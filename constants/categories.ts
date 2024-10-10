export enum CategoriesEnum {
  Food = "Food",
  Exchange = "Exchange",
  Services = "Services",
  Electronics = "Electronics",
  Medicines = "Medicines",
  Books = "Books",
  Home = "Home",
  Games = "Games",
  Computers = "Computers",
  Clothes = "Clothes",
  Other = "Other",
}

// Create the categories array with objects containing the name and icon properties.
export const categories = [
  { name: CategoriesEnum.Food, icon: "food" },
  { name: CategoriesEnum.Exchange, icon: "bitcoin" },
  { name: CategoriesEnum.Services, icon: "wrench" },
  { name: CategoriesEnum.Electronics, icon: "cellphone" },
  { name: CategoriesEnum.Medicines, icon: "pill" },
  { name: CategoriesEnum.Books, icon: "book" },
  { name: CategoriesEnum.Home, icon: "home" },
  { name: CategoriesEnum.Games, icon: "gamepad" },
  { name: CategoriesEnum.Computers, icon: "laptop" },
  { name: CategoriesEnum.Clothes, icon: "tshirt-crew" },
  { name: CategoriesEnum.Other, icon: "dots-horizontal" },
];
