import { colaboradoresMock, workshopsMock } from "../data/mock";

export async function getColaboradores() {
  return colaboradoresMock;
}

export async function getWorkshops() {
  return workshopsMock;
}

export async function getWorkshopById(id) {
  const workshop = workshopsMock.find((w) => w.id === Number(id));
  return workshop ?? null;
}