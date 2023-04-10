import styles from "./tab-bar.module.scss"
import cn from "classnames"
import React from "react";

export function Tab({ isActive, label, onClick }) {
    return (
        <div className={cn(styles.tab, isActive && styles.selected)} onClick={onClick}>
            {label}
        </div>
    );
}

export function TabContent({ children }) {
    return <>{children}</>;
}

export function TabPanel({ children, isActive }) {
    return isActive ? children : null;
}

export function TabHeader({children}) {
    return <>{children}</>
}

export function TabGroup({ children, header, className, changeState }) {
    const [activeTab, setActiveTab] = React.useState(0);

    const handleTabClick = (index) => {
        changeState(index)
        setActiveTab(index)
    };

    return (
        <div>
            <div className={className}>
                <TabHeader>{header}</TabHeader>
                <div className={styles.tabs_container}>
                    {React.Children.map(children, (child, index) => (
                        <Tab
                            key={index}
                            isActive={activeTab === index}
                            label={child.props.label}
                            onClick={() => handleTabClick(index)}
                        />
                    ))}
                </div>
            </div>

            {React.Children.map(children, (child, index) => (
                <TabPanel key={index} isActive={activeTab === index}>
                    {child.props.children}
                </TabPanel>
            ))}
        </div>
    );
}
