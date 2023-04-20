
const PokemonHealth=(hp:number,maxHP:number)=>{

    const hpPercentage = (hp / maxHP) * 100;
    hpPercentage.toFixed(2);

    let hpColor; // varijabla za pohranjivanje boje
    if (hpPercentage > 50) {
        hpColor = 'green';
    } else if (hpPercentage > 20 && hpPercentage<50) {
        hpColor = 'orange';
    } else {
        hpColor = 'red';
    }


    const fontStyle={
        fontSize:"18px"
    }

    const healthStyle = {
        width: `${hpPercentage}%`,
        backgroundColor: hpColor,
        height:"20px",
        borderRadius:"25px",
        border:hpPercentage<=0 ? "solid 1px red" : "0px"
    };
    const healthBar={
        width:"100%",
        height: "20px",
        borderRadius:"25px",
    }


    return (
        <>

        <h3 style={fontStyle} >{hpPercentage.toFixed(2)}%</h3>
            <div style={healthBar}>
                <div style={healthStyle}>

                </div>
            </div>

</>
    );
}

export default PokemonHealth;