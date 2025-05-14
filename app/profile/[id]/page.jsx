import EditableUserInfo from "@/app/components/EditableUserInfo";
import { User } from "@/app/models/User";
import Product from "@/app/models/Products";
import ProductCard from "@/app/components/ProductCard";
import { getSession } from "@/app/lib/getSession";

const profile = async ({ params }) => {
  const { id } = params;
  const user = await User.findById(id);
  const session = await getSession();
  const product = await Product.find({ sellerId: id, isAvailable: true })
    .sort({ dateobj: -1, _id: -1 })
    .populate("sellerId");
  const serializedUser = {
    ...user.toObject(),
    _id: user._id.toString(),
  };
  const serializedProduct = product.map((prod) => ({
    ...prod.toObject(),
    _id: prod._id.toString(),
    sellerId: {
      ...prod.sellerId.toObject(),
      _id: prod.sellerId._id.toString(),
    },
  }));

  return (
    <div>
      <EditableUserInfo user={serializedUser} />
      {serializedUser.role != "buyer" && (
        <div className="sm:px-16 px-8 sm:py-10 pb-12">
          <div className="flex justify-between items-center mb-3">
            <h1 className="text-30-bold">
              <span className="text-primary">{user.username}</span>
              's {serializedProduct.length == 1 ? "Product" : "Products"}
            </h1>
          </div>
          {serializedProduct.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[45vh] gap-2">
              <img
                src="/assets/wagaguri1.png"
                height="180px"
                width="180px"
                alt="No Orders Found"
              />
              <p className="font-semibold text-gray-500 text-lg">
                No Products in Sale!
              </p>
            </div>
          ) : (
            <div className="card_grid gap-5">
              {serializedProduct.map((prod) => (
                <ProductCard key={prod._id} product={prod} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default profile;
