import React from 'react';

const withPluginTheme = (Comp) => {
  const withThemeButton = (props) => {
    const { onClick = () => {}, theme } = props;

    return (
      <div className={theme.buttonWrapper}>
        <button className={theme.button} onClick={onClick}>
          <Comp />
        </button>
      </div>
    )
  }
  return withThemeButton;
}

export default withPluginTheme;
