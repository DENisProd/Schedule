import {useEffect, useRef, useState} from "react";

// import "../../App.css";

import styles from "./swipeble-view-tile.module.scss"
import cn from "classnames"
import {CollapseButton} from "./CollapseButton/CollapseButton";
import {DetailsButton} from "./DetailsButton/DetailsButton";

export default function SwipebleViewTile({isGroup, isRoom, isTeachers, subjects}) {
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
                    subjects &&
                    (subjects[0]?.name + subjects[1]?.name) + subjects[0].startTime
                }
                //     ref={tileRef}
                // onScroll={scrollHandler}
                //     onScroll={scrollHandler}
            >
                {subjects?.map((subject) => (
                    <SubjectTile isGroup={isGroup} isTeachers={isTeachers} isRoom={isRoom} subject={subject}
                                 key={subject._id + subject.name}/>
                ))}
            </div>
            <DotIndicator currentSlide={currentSlide} subjects={subjects}/>
        </>
    );
}

function DotIndicator({currentSlide, subjects}) {
//     useEffect(() => {
//         console.log(Math.round(currentSlide, 1));
//     }, []);
    return (
        <div className={styles.dot_indicator} key={subjects.groupID}>
            {subjects?.length > 1 &&
                subjects.map((subject, index) => (
                    <div key={index + subject.name + subject.teacherName}
                         className={cn(Math.round(Number(currentSlide), 1) === index && styles.current)}
                    />
                ))}
        </div>
    );
}

function SubjectTile({isGroup, isRoom, isTeachers, subject}) {
    const [isFullView, setIsFullView] = useState(false)

    const types = [
        {name: "Военная кафедра", color: styles.green},
        {name: "лаб", color: styles.blue},
        {name: "лек", color: styles.green},
        {name: "пр.", color: styles.pink},
        {name: "пер", color: styles.pink},
        {name: "фв", color: styles.blue},
        {name: "экз", color: styles.blue},
        {name: "зач", color: styles.orange},
        {name: "зчО", color: styles.orange},
    ];

    const getStyle = (name) => {
        for (let i = 0; i < types.length; i++)
            if (name.split(" ")[0].includes(types[i].name))
                return types[i].color;
        return "";
    };

    return (
        <div className={cn(styles.subject_tile, getStyle(subject.name))}
             key={subject.name + (subject.isSubgroup ? "yes" : "no") + subject.teacherName}>
            {/*<div className={cn(styles.subject_tile_left)}>*/}
            {/*    <h1>{subject.number}</h1>*/}
            {/*    <h4 className={styles.time_h}>*/}
            {/*        <span className="time-span">{subject.startTime}</span>*/}
            {/*    </h4>*/}
            {/*    <h4 className={styles.time_h}>*/}
            {/*        <span className="time-span">{subject.endTime}</span>*/}
            {/*    </h4>*/}
            {/*</div>*/}

            <div className={styles.subject_tile_right}>
                <h3>{subject.name}</h3>
                {!isGroup && <p>Группа {subject.groupName}</p>}

                <div className={styles.full_container}>
                    {isFullView ?
                        <div>
                            <p>Аудитория {subject.audName.replace('Подгруппа', '')}</p>
                            <p>{subject.startTime}{' - '}{subject.endTime}</p>
                            <p>{subject.teacherName}</p>
                        </div>
                        :
                        <>
                            <div>Аудитория {subject.audName.replace('Подгруппа', '')}</div>
                            <div>{subject.startTime}{' - '}{subject.endTime}</div>
                        </>
                    }
                    <div className={styles.buttons}>
                        {isFullView &&
                            <DetailsButton subject={subject}/>
                        }
                        <CollapseButton isFullView={isFullView} setIsFullView={setIsFullView}/>
                    </div>
                </div>

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
