import { useEffect, useRef, useState } from "react";

// import "../../App.css";

import styles from "./swipeble-view-tile.module.scss"
import cn from "classnames"

export default function SwipebleViewTile({ isGroup, isRoom, isTeachers, subjects }) {
    const tileRef = useRef(null);

    const [currentSlide, setCurrentSlide] = useState(0);

//     let childs = null;
//     let rect = null;
//     let timer = null;
// //     const [isScrolled, setIsScrolled] = useState(false);
// const isScrolled = useRef(false)

//     const scrollHandler2 = () => {
      
//         const scrollLeft = tileRef.current.scrollLeft;
//         console.log(scrollLeft)
//         //if (childs?.length > 1) {
//         let pos = scrollLeft / rect.width;
//         console.log(scrollLeft)
//         setCurrentSlide(pos);
//         tileRef.current.scrollLeft = scrollLeft;
//         //}
//     };

//     const scrollHandler = () => {
//         if (timer !== null) {
//             clearTimeout(timer);
//         }
//         timer = setTimeout(function () {
//             // do something
//             // setIsScrolled(true)
//             isScrolled.current = true
//         }, 550);
//     };

//     useEffect(() => {
//       childs = tileRef.current.children;
//         rect = tileRef.current.getBoundingClientRect();
//       const scrollLeft = tileRef.current.scrollLeft;
//         //if (childs?.length > 1) {
//         let pos = tileRef.current.scrollLeft / tileRef.current.getBoundingClientRect().width;
//         setCurrentSlide(pos)
//         console.log(scrollLeft)
//         setIsScrolled(false)
//     }, [isScrolled])

//     useEffect(() => {
//         childs = tileRef.current.children;
//         rect = tileRef.current.getBoundingClientRect();
//         //   document.addEventListener("touchstart", handleTouchStart, false);
//         //   document.addEventListener("touchmove", handleTouchMove, false);
//         //   document.addEventListener(
//         //       "scroll",
//         //       function (e) {
//         //             if (isContainerScrolling)
//         //                   e.preventDefault();
//         //           console.log("document scrolling");
//         //       },
//         //       false
//         //   );
//     });

    return (
        <>
            <div
                className={cn(styles.subject_tile_container, subjects?.length > 1 && styles.scrollable)}
                key={
                    new Date() +
                    (subjects &&
                        subjects[0]["номерЗанятия"] + subjects[0]["начало"])
                }
            //     ref={tileRef}
                // onScroll={scrollHandler}
            //     onScroll={scrollHandler}
            >
                {subjects?.map((subject) => (
                    <SubjectTile isGroup={isGroup} isTeachers={isTeachers} isRoom={isRoom} subject={subject} key={subject["код"]}/>
                ))}
            </div>
            <DotIndicator currentSlide={currentSlide} subjects={subjects} />
        </>
    );
}

function DotIndicator({ currentSlide, subjects }) {
//     useEffect(() => {
//         console.log(Math.round(currentSlide, 1));
//     }, []);
    return (
        <div className={styles.dot_indicator} key={subjects["код"]}>
            {subjects?.length > 1 &&
                subjects.map((subject, index) => (
                    <div
                        className={cn(Math.round(Number(currentSlide), 1) === index && styles.current)
                        }
                    />
                ))}
        </div>
    );
}

function SubjectTile({ isGroup, isRoom, isTeachers, subject }) {
    const types = [
        { name: "Военная кафедра", color: styles.green },
        { name: "лаб", color: styles.blue },
        { name: "лек", color: styles.green },
        { name: "пр.", color: styles.pink },
        { name: "пер", color: styles.pink },
        { name: "фв", color: styles.blue },
        { name: "экз", color: "#AADAFF" },
        { name: "зач", color: styles.orange },
        { name: "зчО", color: styles.orange },
    ];

    const getStyle = (name) => {
        for (let i = 0; i < types.length; i++)
            if (name.split(" ")[0].includes(types[i].name))
                return types[i].color;
        return "";
    };

    return (
        <div className={styles.subject_tile}>
            <div className={cn(styles.subject_tile_left, getStyle(subject["дисциплина"]))}>
                <h1>{subject["номерЗанятия"]}</h1>
                <h4 className={styles.time_h}>
                    с <span className="time-span">{subject["начало"]}</span>
                </h4>
                <h4 className={styles.time_h}>
                    до <span className="time-span">{subject["конец"]}</span>
                </h4>
            </div>

            <div className={styles.subject_tile_right}>
                <h3>{subject["дисциплина"]}</h3>
                {!isGroup && <p>Группа {subject["группа"]}</p>}
                <p>Аудитория {subject["аудитория"]}</p>
                <p>{subject["преподаватель"]}</p>
            </div>
        </div>
    );
}

// let timer = null;
//     let isContainerScrolling = false;

//     let xDown = null;
//     let yDown = null;

//     const getTouches = (evt) => {
//         return (
//             evt.touches || // browser API
//             evt.originalEvent.touches
//         ); // jQuery
//     };

//     const handleTouchStart = (evt) => {
//         const firstTouch = getTouches(evt)[0];
//         xDown = firstTouch.clientX;
//         yDown = firstTouch.clientY;

//         const rect = tileRef.current.getBoundingClientRect();
//         if (
//             !(
//                 xDown >= rect.left &&
//                 xDown <= rect.right &&
//                 yDown <= rect.bottom &&
//                 yDown >= rect.top
//             )
//         ) {
//             /* reset values */
//             xDown = null;
//             yDown = null;
//         }
//     };

//     const handleTouchMove = (evt) => {
//         if (!xDown || !yDown) {
//             return;
//         }

//         let xUp = evt.touches[0].clientX;
//         let yUp = evt.touches[0].clientY;

//         let xDiff = xDown - xUp;
//         let yDiff = yDown - yUp;

//         const rect = tileRef.current.getBoundingClientRect();

//         console.log(xDiff, yDiff);

//         if (Math.abs(xDiff) > Math.abs(yDiff)) {
//             /*most significant*/
//             if (xDiff > 0) {
//                 /* right swipe */
//                 console.log("RIGHT");
//                 //tileRef.current.style.transform = 'translateX(' + rect.width +'px)'
//                 // tileRef.current.scrollLeft = rect.width
//             } else {
//                 /* left swipe */
//             }
//         } else {
//             if (yDiff > 0) {
//                 /* down swipe */
//             } else {
//                 /* up swipe */
//             }
//         }
//         /* reset values */
//         xDown = null;
//         yDown = null;
//     };

//     const scrollHandler = () => {
//         //   const rect = tileRef.current.getBoundingClientRect();
//         //   console.log(tileRef.current.scrollLeft);
//         //   if (tileRef.current.scrollLeft > rect.width / 2) {
//         //       tileRef.current.style.left = rect.width;
//         //   }
//         console.log("tile scrolling");
//         isContainerScrolling = true;
//         if (timer !== null) {
//             clearTimeout(timer);
//         }
//         timer = setTimeout(function () {
//             // do something
//             console.log("tile stop scrolling");
//             isContainerScrolling = false;
//         }, 150);
//     };
