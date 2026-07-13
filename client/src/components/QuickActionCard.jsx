import { Link } from "react-router-dom";

function QuickActionCard({
    icon,
    title,
    description,
    link
}) {
    return (
        <Link to={link}>

            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl hover:-translate-y-1 transition cursor-pointer">

                <div className="text-4xl mb-4">
                    {icon}
                </div>

                <h2 className="text-xl font-bold">
                    {title}
                </h2>

                <p className="text-gray-500 mt-2">
                    {description}
                </p>

            </div>

        </Link>
    );
}

export default QuickActionCard;