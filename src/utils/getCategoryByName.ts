const validNames = ["livsmart", "worksmart", "ebco"];
interface Category {
  id: number;
  name: string;
  slug?: string;
}
export const getCategoryByName = (
  categories: Category[]
): Category | undefined => {
  return categories?.find((category) =>
    validNames?.includes(category?.name.toLowerCase())
  );
};
