export function groupBy<T>(array: T[], property: keyof T) {
  return array.reduce((acc: { [key: string]: T[] }, item) => {
    const key = item[property] as string;

    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);

    return acc;
  }, {});
}
