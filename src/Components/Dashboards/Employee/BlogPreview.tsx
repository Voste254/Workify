const BlogPreview = () => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Career Insights</h3>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="border rounded-xl p-4">
          <h4 className="font-semibold mb-2">
            10 Tips to Ace Your Interview
          </h4>
          <p className="text-sm text-gray-600">
            Prepare effectively and stand out in Kenya's job market.
          </p>
        </div>

        <div className="border rounded-xl p-4">
          <h4 className="font-semibold mb-2">
            How to Build a Strong CV
          </h4>
          <p className="text-sm text-gray-600">
            Learn how to craft a compelling CV for employers.
          </p>
        </div>

        <div className="border rounded-xl p-4">
          <h4 className="font-semibold mb-2">
            Career Growth in 2026
          </h4>
          <p className="text-sm text-gray-600">
            Explore the fastest growing industries in Kenya.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BlogPreview;
