import cn from "classnames";
import styles from "./search.module.scss";
import React from "react";

function ConditionLayer({children, state, setState}) {
    return (
        <div className={cn(styles.list, state && styles.active)}>
            {state && <>{children}</>}
        </div>
    )
}

export default ConditionLayer