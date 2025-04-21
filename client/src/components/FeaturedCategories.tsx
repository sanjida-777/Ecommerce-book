import { Link } from 'wouter';

const categories = [
  {
    id: 'fiction',
    title: 'Fiction',
    description: 'Explore imaginative worlds',
    image: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'non-fiction',
    title: 'Non-Fiction',
    description: 'Discover true stories',
    image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'children',
    title: 'Children\'s',
    description: 'Magical stories for young readers',
    image: 'https://images.unsplash.com/photo-1535905557558-afc4877a26fc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  }
];

export default function FeaturedCategories() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="font-heading font-bold text-3xl mb-8">Explore Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link key={category.id} href={`/category/${category.id}`}>
              <div className="group relative h-64 rounded-lg overflow-hidden shadow-md cursor-pointer">
                <img 
                  src={category.image} 
                  alt={`${category.title} books`} 
                  className="w-full h-full object-cover transition duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="text-white font-heading font-bold text-2xl mb-1">{category.title}</h3>
                  <p className="text-white text-opacity-80">{category.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
