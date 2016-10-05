<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="text"/>
<xsl:output method="text" indent="yes" name="text"/>

<xsl:template match="/">
<xsl:for-each select="/root/record">
<xsl:variable name="main_name"
 select="concat(upper-case(substring(./main_name ,1,1)),
          substring(./main_name, 2),
          ' '[not(last())]
         )" />
<xsl:variable name="filename"
  select="concat(main_package,'.orm/',$main_name,'.java')" />
<xsl:value-of select="$filename" />  <!-- Creating  -->
<xsl:result-document href="{$filename}" format="text">

package <xsl:value-of select="main_package"/>.orm;
<xsl:for-each select="./field"><xsl:if test="pootype/mainPackage!=''">
import <xsl:value-of select="pootype/mainPackage"/>.<xsl:value-of select="pootype/des_type"/>;
</xsl:if></xsl:for-each>
/*
*@author Generics 2014
*/

public class <xsl:call-template name="FUCase"><xsl:with-param name="texto" select="./main_name"/></xsl:call-template> {
	public final static String TABLA = "<xsl:value-of select="upper-case(./main_name)"/>";<xsl:for-each select="./field">
<xsl:if test="./isPK='true'">	
	public final static String CAMPO_PK_<xsl:value-of select="upper-case(./field_name)"/> = "<xsl:value-of select="upper-case(./field_name)"/>";</xsl:if>
</xsl:for-each>
<xsl:if test="./secuence!=''">	public final static String SQ = "<xsl:value-of select="upper-case(secuence)"/>";</xsl:if><xsl:for-each select="./field">
<xsl:if test="./isPK='false'">
	public final static String CAMPO_<xsl:value-of select="upper-case(./field_name)"/> = "<xsl:value-of select="upper-case(./field_name)"/>";</xsl:if>
</xsl:for-each>
<xsl:text>
</xsl:text>
<xsl:apply-templates select="./field" mode="generateField"/>
<xsl:text>
</xsl:text>
<xsl:apply-templates select="./field" mode="generateGetter"/>
<xsl:apply-templates select="./field" mode="generateSetter"/>

}
</xsl:result-document>
</xsl:for-each>
</xsl:template>


		<!--
    *****************************************************************
    ** Generate a private field declaration.
    **************************************************************-->
    <xsl:template match="field" mode="generateField">
    private <xsl:value-of select="pootype/des_type"/>
    <xsl:text> </xsl:text>
    <xsl:value-of select="./field_name"/>;</xsl:template>
		
	<!--
	*****************************************************************
	** Generate a "get" method for a field.
	**************************************************************-->
	<xsl:template match="field" mode="generateGetter">
	<xsl:variable name="type" select="pootype/des_type"/>
	public <xsl:value-of select="pootype/des_type"/>
		<xsl:choose>
			<xsl:when test="$type = 'Timestamp'"> get<xsl:call-template name="FUCase"><xsl:with-param name="texto" select="./field_name"/></xsl:call-template>(){
		if(this.<xsl:value-of select="./field_name"/> == null)
			this.<xsl:value-of select="./field_name"/> = new java.sql.Timestamp(new java.util.Date().getTime());
		return this.<xsl:value-of select="./field_name"/>;
	}
			</xsl:when>
			<xsl:otherwise> get<xsl:call-template name="FUCase"><xsl:with-param name="texto" select="./field_name"/></xsl:call-template>(){
		return this.<xsl:value-of select="./field_name"/>;
	}
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	
 <!--
    *****************************************************************
    ** Generate a "set" method for a field.
    **************************************************************-->
    <xsl:template match="field" mode="generateSetter">
    public void	set<xsl:call-template name="FUCase"><xsl:with-param name="texto" select="./field_name"/></xsl:call-template>(<xsl:value-of select="pootype/des_type"/><xsl:text> </xsl:text><xsl:value-of select="./field_name"/>){
		this.<xsl:value-of select="./field_name"/> = <xsl:value-of select="./field_name"/>;
	}		
    </xsl:template>	
	
	
	<xsl:template name="FUCase">
		<xsl:param name="texto"/>
		<xsl:if test="$texto != ''">
        <xsl:value-of select="concat(upper-case(substring($texto ,1,1)),
          substring($texto, 2),
          ' '[not(last())]
         )"/> 
		</xsl:if>      
	</xsl:template>

</xsl:stylesheet>
