import cn from "classnames";
import styles from "./search.module.scss";
import React from "react";
import Loader2 from "../../Loader/Loader2";

function ConditionLayer({children, state, setState, enabled}) {
    return (
        // <div className={cn(styles.list, styles.active)}>
        <div className={cn(styles.list, state && styles.active)}>
            {enabled ?
                <>
                    {state ?
                        <>{children}</>
                        :
                        <div className={styles.loader}><Loader2/></div>
                    }
                </>
            :
                <><h3>Для данного университета функция отключена</h3></>
            }
        </div>
    )
}

export default ConditionLayer