import { addPropertyControls, ControlType } from "framer"
import { useEffect, useState } from "react"

const COURSES_API =
    "https://syncsphere-hiv6.onrender.com/assignment/course-data"

const COUNTRY_API =
    "https://syncsphere-hiv6.onrender.com/assignment/country-code"

export default function SkillpathCourses(props) {
    const { accentColor, cardStyle } = props

    const [courses, setCourses] = useState([])
    const [country, setCountry] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    function loadCourses() {
        setLoading(true)
        setError(false)

        // Fetch course data
        fetch(COURSES_API)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Course request failed")
                }

                return response.json()
            })
            .then((data) => {
                setCourses(data)
                setLoading(false)
            })
            .catch(() => {
                setError(true)
                setLoading(false)
            })

        // Fetch country separately
        fetch(COUNTRY_API)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Country request failed")
                }

                return response.json()
            })
            .then((data) => {
                setCountry(data.country_code)
            })
            .catch(() => {
                // Courses can still be shown
                // if the country request fails.
                setCountry(null)
            })
    }

    // Load the data when the component appears
    useEffect(() => {
        loadCourses()
    }, [])

    // -------------------------
    // LOADING STATE
    // -------------------------

    if (loading) {
        return (
            <div style={styles.message}>
                <div className="loading-spinner" />

                <p>Loading courses...</p>

                <style>{`
                    .loading-spinner {
                        width: 32px;
                        height: 32px;
                        border: 3px solid #E7F6F2;
                        border-top: 3px solid #395B64;
                        border-radius: 50%;
                        animation: spin 0.8s linear infinite;
                    }

                    @keyframes spin {
                        to {
                            transform: rotate(360deg);
                        }
                    }
                `}</style>
            </div>
        )
    }

    // -------------------------
    // ERROR STATE
    // -------------------------

    if (error) {
        return (
            <div style={styles.message}>
                <h3 style={styles.messageTitle}>Unable to load courses</h3>

                <p style={styles.messageText}>
                    Something went wrong while loading the courses.
                </p>

                <button
                    onClick={loadCourses}
                    style={{
                        ...styles.button,
                        backgroundColor: accentColor,
                    }}
                >
                    Try Again
                </button>
            </div>
        )
    }

    // -------------------------
    // EMPTY STATE
    // -------------------------

    if (courses.length === 0) {
        return (
            <div style={styles.message}>
                <h3 style={styles.messageTitle}>No courses available</h3>

                <p style={styles.messageText}>
                    There aren't any courses available right now.
                </p>
            </div>
        )
    }

    // -------------------------
    // COURSE GRID
    // -------------------------

    return (
        <div style={styles.container}>
            <div className="course-grid">
                {courses.map((course) => (
                    <div
                        key={course.courseCode}
                        style={{
                            ...styles.card,

                            border:
                                cardStyle === "minimal"
                                    ? "1px solid #A5C9CA"
                                    : "none",

                            boxShadow:
                                cardStyle === "elevated"
                                    ? "0 8px 25px rgba(57, 91, 100, 0.15)"
                                    : "none",
                        }}
                    >
                        {/* Category */}
                        <p
                            style={{
                                ...styles.category,
                                color: accentColor,
                            }}
                        >
                            {course.mainCategory}
                        </p>

                        {/* Course name */}
                        <h3 style={styles.title}>{course.courseName}</h3>

                        {/* Description */}
                        <p style={styles.description}>{course.description}</p>

                        {/* Bottom section */}
                        <div style={styles.bottom}>
                            <div>
                                <p style={styles.courseType}>
                                    {course.courseType}
                                </p>

                                <strong style={styles.price}>
                                    {getPrice(course, country)}
                                </strong>
                            </div>

                            {/* Refundable badge */}
                            {course.refundable && (
                                <span
                                    style={{
                                        ...styles.badge,
                                        backgroundColor: "#A5C9CA",
                                        color: "#395B64",
                                    }}
                                >
                                    Refundable
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                .course-grid {
                    display: grid;
                    grid-template-columns: repeat(3, minmax(0, 1fr));
                    gap: 20px;
                    width: 100%;
                }

                @media (max-width: 900px) {
                    .course-grid {
                        grid-template-columns: repeat(2, minmax(0, 1fr));
                    }
                }

                @media (max-width: 600px) {
                    .course-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    )
}

// --------------------------------
// PRICE FORMATTING
// --------------------------------

function getPrice(course, country) {
    // India
    if (country === "IN") {
        const price = course.pricePaise / 100

        return `₹${price.toLocaleString("en-IN")}`
    }

    // United States
    if (country === "US") {
        const price = course.priceUsdCents / 100

        return `$${price.toFixed(2)}`
    }

    // Country API failed
    return "Price unavailable"
}

// --------------------------------
// STYLES
// --------------------------------

const styles = {
    container: {
        width: "100%",
        boxSizing: "border-box",
    },

    card: {
        backgroundColor: "#E7F6F2",
        borderRadius: 18,
        padding: 24,
        minHeight: 240,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
    },

    category: {
        fontSize: 13,
        fontWeight: 700,
        margin: "0 0 12px",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
    },

    title: {
        fontSize: 22,
        lineHeight: 1.2,
        margin: "0 0 12px",
        color: "#395B64",
    },

    description: {
        fontSize: 14,
        lineHeight: 1.5,
        color: "#395B64",
        margin: "0 0 20px",

        // Limit description to two lines
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
    },

    bottom: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        gap: 12,
        marginTop: "auto",
    },

    courseType: {
        fontSize: 12,
        color: "#395B64",
        margin: "0 0 5px",
        opacity: 0.7,
    },

    price: {
        fontSize: 21,
        fontWeight: 700,
        color: "#395B64",
    },

    badge: {
        fontSize: 11,
        fontWeight: 700,
        padding: "6px 10px",
        borderRadius: 20,
        whiteSpace: "nowrap",
    },

    message: {
        minHeight: 250,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: 30,
        color: "#395B64",
        boxSizing: "border-box",
    },

    messageTitle: {
        margin: "15px 0 5px",
        color: "#395B64",
        fontSize: 22,
    },

    messageText: {
        margin: "0 0 20px",
        color: "#395B64",
        opacity: 0.75,
    },

    button: {
        border: "none",
        color: "#E7F6F2",
        padding: "11px 20px",
        borderRadius: 10,
        cursor: "pointer",
        fontSize: 14,
        fontWeight: 700,
    },
}

// --------------------------------
// FRAMER PROPERTY CONTROLS
// --------------------------------

addPropertyControls(SkillpathCourses, {
    accentColor: {
        title: "Accent Color",
        type: ControlType.Color,
        defaultValue: "#395B64",
    },

    cardStyle: {
        title: "Card Style",
        type: ControlType.Enum,
        options: ["minimal", "elevated"],
        optionTitles: ["Minimal", "Elevated"],
        defaultValue: "elevated",
        displaySegmentedControl: true,
    },
})
