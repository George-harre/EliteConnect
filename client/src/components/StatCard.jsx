function StatCard({ icon, title, value }) {
    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl hover:-translate-y-1 transition">

            <div className="text-4xl mb-3">
                {icon}
            </div>

            <h3 className="text-gray-600">
                {title}
            </h3>

            <p className="text-3xl font-bold text-pink-600 mt-2">
                {value}
            </p>

        </div>
    );
}

export default StatCard;